import { useState } from "react"
import style from "./Chart.module.css"
import React, { useEffect } from "react"
import Chart from "chart.js/auto"

function PieChart({ ratingIdeaEachDepartment }) {
  const [chart, setChart] = useState(null)

  useEffect(() => {
    const bienx = []
    const bieny = []
    if (Array.isArray(ratingIdeaEachDepartment)) {
      ratingIdeaEachDepartment.forEach((rating) => {
        bienx.push(rating._id[0])
        bieny.push(rating.persent)
      })
    }
    const CHART = document.getElementById("piechart").getContext("2d")
    if (chart) {
      chart.destroy()
    }
    const pieChart = new Chart(CHART, {
      type: "pie",
      data: {
        labels: bienx,
        datasets: [
          {
            label: "Engagements",
            data: bieny,
            backgroundColor: ["#bc6c25", "#457b9d", "#2a9d8f", "#4a4e69"],
            borderColor: ["#bc6c25", "#457b9d", "#2a9d8f", "#4a4e69"],
            borderWidth: 2
          }
        ]
      },
      options: {
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex]
              var currentValue = dataset.data[tooltipItem.index]
              return currentValue.toFixed(1) + "%" // hiển thị giá trị phần trăm và đơn vị phần trăm
            },
          },
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function (value) {
                  return value + "%" // thêm ký hiệu phần trăm vào giá trị trên trục y
                }
              }
            }
          ]
        }
      }
    })
    setChart(pieChart)
  }, [ratingIdeaEachDepartment])

  return (
    <div className={style.containerPiechart}>
      <canvas id="piechart"></canvas>
    </div>
  )
}

export default PieChart
