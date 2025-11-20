import {
  SquarePlus,
  ShieldCheck,
  Bookmark,
  Proportions,
  Bug,
} from "lucide-react";
import {
  ChevronsUp,
  ChevronUp,
  EqualApproximately,
  ChevronDown,
  ChevronsDown,
} from "lucide-react";

export const workTypeIconMap = (workType) => {
  switch (workType) {
    case "Request":
      return <SquarePlus color="#498563" size={16} strokeWidth={1} />;

    case "Task":
      return <ShieldCheck color="#498563" size={16} strokeWidth={1} />;
    case "Story":
      return <Bookmark color="#498563" size={16} strokeWidth={1} />;
    case "Feature":
      return <Proportions color="#498563" size={16} strokeWidth={1} />;

    case "Bug":
      return <Bug color="#498563" size={16} strokeWidth={0.75} />;
  }
};

export const PriorityIconMap = (priority) => {
  switch (priority) {
    case "Highest":
      return <ChevronsUp color="#f15b50" size={16} strokeWidth={2.5} />;
    case "High":
      return <ChevronUp color="#f15b50" size={16} strokeWidth={2.5} />;
    case "Medium":
      return <EqualApproximately color="#e06c00" size={16} strokeWidth={2.5} />;
    case "Low":
      return <ChevronDown color="#4688ec" size={16} strokeWidth={2.5} />;
    case "Lowest":
      return <ChevronsDown color="#4688ec" size={16} strokeWidth={2.5} />;
    default:
      return <> </>;
  }
};
