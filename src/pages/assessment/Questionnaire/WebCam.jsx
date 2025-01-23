
import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { axiosServerInstanceWithoutCredentials } from "@/utils/api/instances";
import { serverRoutes } from "@/utils/api/routes";
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";

const bucketName = import.meta.env.VITE_AWS_S3_BUCKET_NAME;
const region = import.meta.env.VITE_AWS_REGION;
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey =import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;



const WebCam = () => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const proctorId = useSelector((state) => state?.assessment?.assessmentTestData?.report?.proctorId);

  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const updateProctorVideoUrl = async (s3Url) => {
    try {
      await axiosServerInstanceWithoutCredentials.put(serverRoutes.submitVideoUrl, {
        proctorId,
        s3Url,
      });
    } catch (error) {
      console.error("Error updating proctor:", error.response?.data || error.message);
    }
  };

  // Initiates a multipart upload
  const initiateMultipartUpload = async (key) => {
    try {
      const command = new CreateMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        ContentType: 'video/mp4',
      });
      const response = await s3Client.send(command);
      return response.UploadId; // Return the upload ID to use for subsequent part uploads
    } catch (error) {
      console.error("Error initiating multipart upload:", error);
      throw error;
    }
  };

  // Uploads a part in the multipart upload
  const uploadPart = async (uploadId, key, partNumber, body) => {
    try {
      const command = new UploadPartCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
        Body: body,
      });
      const response = await s3Client.send(command);
      return response.ETag; // Return the ETag of the uploaded part
    } catch (error) {
      console.error(`Error uploading part ${partNumber}:`, error);
      throw error;
    }
  };

  // Completes the multipart upload once all parts are uploaded
  const completeMultipartUpload = async (uploadId, key, parts) => {
    try {
      const command = new CompleteMultipartUploadCommand({
        Bucket: bucketName,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: { Parts: parts },
      });
      const response = await s3Client.send(command);
      return response.Location; // Return the location of the uploaded file
    } catch (error) {
      console.error("Error completing multipart upload:", error);
      throw error;
    }
  };

  const uploadToS3InParts = async (blob) => {
    const key = `${proctorId}-${Date.now()}.mp4`;
    let uploadId;
    
    try {
      uploadId = await initiateMultipartUpload(key); //  Initiate multipart upload
    } catch (error) {
      console.error("Failed to initiate multipart upload", error);
      return;
    }

    const partSize = 6 * 1024 * 1024; // 6MB chunk size
    const totalParts = Math.ceil(blob.size / partSize);
    const parts = [];

    for (let i = 0; i < totalParts; i++) {
      const start = i * partSize;
      const end = Math.min(start + partSize, blob.size);
      const blobPart = blob.slice(start, end); // Create blob part
      const partNumber = i + 1; // S3 part numbers are 1-based
      try {
        const eTag = await uploadPart(uploadId, key, partNumber, blobPart); // Upload each part
        parts.push({ PartNumber: partNumber, ETag: eTag });
      } catch (error) {
        console.error(`Error uploading part ${partNumber}`, error);
        return; // Stop further uploads if an error occurs
      }
    }

    try {
      const s3Url = await completeMultipartUpload(uploadId, key, parts); //  Complete multipart upload
      await updateProctorVideoUrl(s3Url); // Update the server with the S3 video URL
      console.log("Video uploaded to S3 successfully:", s3Url);
    } catch (error) {
      console.error("Failed to complete multipart upload", error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      throw error;
    }
  };

  const startRecording = (stream) => {
    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = async () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/mp4' });
      await uploadToS3InParts(blob); // Upload video in parts
      recordedChunksRef.current = []; // Clear chunks after upload
    };
    
    mediaRecorder.start(); // Start recording
    mediaRecorderRef.current = mediaRecorder;
  };

  useEffect(() => {
    let stream;
    const init = async () => {
      stream = await startCamera();
      startRecording(stream);
    };
    init();

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />;
};

export default WebCam;

