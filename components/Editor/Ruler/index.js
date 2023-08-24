import React from "react";


export default function Ruler({
  steps = [],
 
}) {
  return (
    <div className="ruler" >

      {steps.map((step, idx) => (
        <label key={step} className="ruler-x">
          {step}

        </label>
      ))}

    </div>
  );
}

