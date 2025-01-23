import { Label } from "@/lib/ui/label";
import { RadioGroup, RadioGroupItem } from "@/lib/ui/radio-group";

const MultipleChoice = ({ selectOptionId, setSelectOptionId, options }) => {
  return (
    <div className={`h-full overflow-y-scroll p-4`}>
      <RadioGroup defaultValue="" value={selectOptionId}>
        {options.map(({ id, optionText }) => (
          <div
            key={id}
            onClick={() => setSelectOptionId(id)}
            className={`flex items-center gap-2 text-gray-700 p-3 pl-4 pr-4 rounded-md cursor-pointer ${
              selectOptionId === id
                ? "border border-primary"
                : "border border-gray-300"
            }`}
          >
            <RadioGroupItem value={id} id={id} className="border-gray-200" />
            <Label htmlFor={id} className="text-base font-normal">
              {optionText}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MultipleChoice;
