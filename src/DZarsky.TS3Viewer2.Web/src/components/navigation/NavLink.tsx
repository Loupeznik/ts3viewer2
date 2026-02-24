import { Link } from "react-router";
import { Button } from "@/components/ui/button";

type LinkProps = {
  url: string;
  name: string;
  isActive: boolean;
};

export const NavLink = (props: LinkProps) => {
  return (
    <li>
      <Button
        variant="ghost"
        size="sm"
        asChild
        className={props.isActive ? "text-white bg-accent" : "text-gray-400 hover:text-white"}
      >
        <Link to={props.url}>{props.name}</Link>
      </Button>
    </li>
  );
};
