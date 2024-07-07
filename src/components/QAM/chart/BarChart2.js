import style from "./Chart.module.css"
import React, { useState, useEffect } from "react"
import Chart from "chart.js/auto"

function BarChart2({ ratingContributorsPostedIdeasEachDepartment }) {
  const [chart, setChart] = useState(null)
  useEffect(() => {
    const bienx = []
    const bieny = []
    if (Array.isArray(ratingContributorsPostedIdeasEachDepartment)) {
      ratingContributorsPostedIdeasEachDepartment.forEach((rating) => {
        bienx.push(rating._id)
        bieny.push(rating.nUser)
      })
    }
    const CHART = document.getElementById("barchart2").getContext("2d")
    if (chart) {
      chart.destroy()
    }
    const barchart2 = new Chart(CHART, {
      type: "bar",
      data: {
        labels: bienx,
        datasets: [
          {
            label: " the ratio of the number of contributors to the total number of people in each department",
            data: bieny,
            backgroundColor: ["#006d77","#83c5be","#ffddd2","#e29578"],
            borderColor: ["#006d77","#83c5be","#ffddd2","#e29578"],
            borderWidth: 2
          },
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    })
    setChart(barchart2)
  }, [ratingContributorsPostedIdeasEachDepartment])

  return (
    <div className={style.containerMixchart}>
      <canvas id="barchart2"></canvas>
    </div>
  )
}

export default BarChart2
