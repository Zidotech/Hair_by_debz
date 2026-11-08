"use client";

import { useCallback, useEffect, useState } from "react";
import { LOGO_SRC } from "@/shared/ui/logo";

export function Splash({ onDone }: { onDone: () => void }) {
  const [go, setGo] = useState(false);
  const finish = useCallback(() => {
    setGo(true);
    setTimeout(onDone, 1000);
  }, [onDone]);
  useEffect(() => {
    const id = setTimeout(finish, 2400);
    return () => clearTimeout(id);
  }, [finish]);
  const mask = `url("${LOGO_SRC.tertiary}") center/contain no-repeat`;
  return (
    <div className={"splash" + (go ? " go" : "")} onClick={finish} aria-hidden="true">
      <div className="mark">
        <div className="ring" />
        <div className="seal" style={{ WebkitMask: mask, mask }} />
      </div>
      <div className="tag">The art of a flawless finish</div>
      <div className="bar"><i /></div>
    </div>
  );
}
