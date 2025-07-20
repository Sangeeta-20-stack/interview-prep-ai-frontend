import React from "react";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";
import Modal from "../Modal";

const SummaryCard = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-shadow relative group"
      onClick={onSelect}
    >
      {/* Top Section */}
      <div
        className="rounded-t-2xl p-4 relative"
        style={{
          background: colors.bgcolor,
        }}
      >
        <div className="flex items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 w-12 h-12 bg-white rounded-md flex items-center justify-center mr-4 shadow-sm">
            <span className="text-lg font-semibold text-black">
                {getInitials(role)}
            </span>
          </div>

          {/* Role + Topics */}
          <div className="flex-grow">
            <h2 className="text-base font-semibold text-black">{role}</h2>
            <p className="text-sm text-gray-700">{topicsToFocus}</p>
          </div>
        </div>

        {/* Delete Button */}
        <button
          className="absolute top-3 right-3 bg-red-100 hover:bg-red-200 text-red-600 p-1.5 rounded-full shadow-sm transition-opacity opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Section */}
      <div className="px-4 pb-4 pt-2">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 text-[11px] text-black font-medium">
          <span className="px-3 py-1 border border-gray-400 rounded-full">
            Experience: {experience} {experience == 1 ? "Year" : "Years"}
          </span>
          <span className="px-3 py-1 border border-gray-400 rounded-full">
            {questions} Q&A
          </span>
          <span className="px-3 py-1 border border-gray-400 rounded-full">
            Last Updated: {lastUpdated}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-gray-600 mt-3 line-clamp-2">
          {description}
        </p>
      </div>
    </div>

    
  );
};

export default SummaryCard;
