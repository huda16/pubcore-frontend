import { ForwardRefRenderFunction, forwardRef } from "react";

import Link from "next/link";

type LinkBehaviourProps = React.ComponentPropsWithoutRef<typeof Link>;

const LinkBehaviourComponent: ForwardRefRenderFunction<
  HTMLAnchorElement,
  LinkBehaviourProps
> = (props, ref) => {
  return <Link ref={ref} {...props} />;
};

export const LinkBehaviour = forwardRef(LinkBehaviourComponent);
