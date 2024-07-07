import style from "./Chart.module.css";
import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";

//Sử dụng useEffect để tạo biểu đồ khi component được render.
//Sử dụng const để khai báo các biến.
//Thêm một options object để tùy chỉnh trục y của biểu đồ.

function BarChart({ data }) {
  const [chart, setChart] = useState(null)
  let data1 = data
  let bieny = []
 
  useEffect(() => {
    const bienx = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ]
    if (data1) {
      bieny = [data1[0].count, data1[1].count, data1[2].count, data1[3].count, data1[4].count, data1[5].count, data1[6].count, data1[7].count, data1[8].count, data1[9].count, data1[10].count, data1[11].count]
    }
    const CHART = document.getElementById("barchart").getContext("2d")
    if (chart) {
      chart.destroy()
    }
    const barchart = new Chart(CHART, {
      type: "bar",
      data: {
        labels: bienx,
        datasets: [
          {
            label: "total_idea",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            data: bieny
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              }
            }
          ]
        }
      }
    })
    setChart(barchart)
  }, [data1])

  return (
    <div className={style.containerBarchart}>
      <canvas id="barchart"></canvas>
    </div>
  )
}

export default BarChart
