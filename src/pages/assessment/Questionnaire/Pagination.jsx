/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "@/lib/ui/button";
import { getPaginationItems } from "@/utils/methods";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

// PAGINATION STYLES
const markedForReviewStyle = `bg-yellow-500 text-white hover:bg-yellow-500 hover:text-white`;
const attemptedStyle = `bg-primary`;
const notAttemptedStyle = `bg-white text-gray-700 hover:bg-white text-gray-700`;
const currentStyle = `bg-slate-300 text-white hover:bg-slate-300 hover:text-white`;

const Pagination = ({ currentPage, changeCurrentPage, items }) => {
  const [paginationItems, setPaginationItems] = useState([]);

  const handleNextPage = () => {
    if (currentPage < items.length - 1) {
      changeCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      changeCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const list = getPaginationItems(currentPage, items);
    setPaginationItems(list);
  }, [items, currentPage]);

  return (
    <div className="h-[8vh] p-4 bg-slate-200 flex items-center gap-5">
      <p className="text-gray-700 font-medium">Questions</p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 border-gray-300"
          onClick={handlePrevPage}
        >
          <ChevronLeft size="20" />
        </Button>
        {paginationItems.map((item) => {
          const {
            page,
            id,
            markedForReview,
            providedAnswer,
            selectedOptionId,
          } = item;

          const isAttempted = selectedOptionId || providedAnswer;
          const style =
            currentPage === page
              ? currentStyle
              : markedForReview
              ? markedForReviewStyle
              : isAttempted
              ? attemptedStyle
              : notAttemptedStyle;
          return (
            <Button
              key={id}
              size="icon"
              className={`rounded-full h-8 w-8 border border-gray-300 ${style}`}
              onClick={() => changeCurrentPage(page)}
            >
              {page + 1}
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-8 w-8 border-gray-300"
          onClick={handleNextPage}
        >
          <ChevronRight size="20" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;

// import { Button } from "@/lib/ui/button";
// import { ChevronUp } from "lucide-react";
// import { useEffect, useState } from "react";

// // attempted
// // not attempted
// // marked for review (attempted or not attemped)

// const Pagination = ({ currentPage, changeCurrentPage, items }) => {
//   const paginationItemsPerPage = 5;
//   const [paginationItems, sePaginationItems] = useState([]);

//   useEffect(() => {
//     const length = currentPage + paginationItemsPerPage;
//     if (length >= items.length) {
//       const newItems = items.slice(
//         items.length - paginationItemsPerPage,
//         items.length
//       );
//       sePaginationItems(newItems);
//       return;
//     } else {
//       const start = currentPage;
//       const end = paginationItemsPerPage + currentPage;
//       const newItems = items.slice(start, end);
//       sePaginationItems(newItems);
//     }
//   }, [currentPage, items]);

//   const onPageChange = (page) => {
//     changeCurrentPage(page);
//   };

//   const handleNextPage = () => {
//     if (currentPage < items.length - 1) {
//       changeCurrentPage(currentPage + 1);
//     }
//   };

//   const handlePrevPage = () => {
//     if (currentPage > 0) {
//       changeCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="h-[8vh] p-4 bg-slate-200/80 flex items-center gap-5">
//       <p className="font-medium">Questions</p>
//       <div className="flex items-center gap-2">
//         <Button
//           onClick={handlePrevPage}
//           disabled={currentPage == 0}
//           size="icon"
//           className="h-8 w-8 rounded-full bg-white border border-grayCustom-500 hover:bg-current"
//         >
//           <ChevronUp size="16" className="-rotate-90 text-grayCustom-800" />
//         </Button>
//         {paginationItems.map((item) => {
//           const {
//             id,
//             page,
//             markedForReview,
//             // providedAnswer,
//             // selectedOptionId,
//             // Question,
//           } = item;

//           const style = markedForReview
//             ? "bg-yellowCustom-500 hover:bg-yellowCustom-500/90"
//             : page === currentPage
//             ? "bg-primary-500 hover:bg-primary-500/90"
//             : "text-grayCustom-800 bg-white border border-grayCustom-500 hover:bg-inherit";

//           return (
//             <Button
//               key={id}
//               size="icon"
//               className={`h-8 w-8 rounded-full ${style}`}
//               onClick={() => onPageChange(page)}
//             >
//               {page + 1}
//             </Button>
//           );
//         })}
//         <Button
//           disabled={currentPage === items.length - 1}
//           onClick={handleNextPage}
//           size="icon"
//           className="h-8 w-8 rounded-full bg-white border border-grayCustom-500 hover:bg-current"
//         >
//           <ChevronUp size="16" className="rotate-90 text-grayCustom-800" />
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Pagination;
