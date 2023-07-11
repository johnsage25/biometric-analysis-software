import React from "react";
import { Column } from "@silevis/reactgrid";

const monthsArray = (numOfMonths: number) => {
  let array: Column[] = Array.from(
    { length: numOfMonths },
    (_, i) => i + 1
  ).map((x) => {
    return { columnId: `D${x}`, width: 60 };
  });


  return array;
};

const getCellsDynamically = (row: any) => {

  //   delete row.staff_name
  delete row.year;
  delete row.createdAt;
  delete row.updatedAt;
  delete row.sheet;
  delete row.month;
  delete row.cellDate;
  delete row._id;
  delete row.year;

  let staticArray: any = [];

  Object.entries(row).forEach(([key, value], index) => {
    staticArray.push({
      type: "text",
      text: value || "",
      className: `id-${index} py-4 px-2 ${key}`,
    });
  });


  return [...staticArray];
};

export { monthsArray, getCellsDynamically };
