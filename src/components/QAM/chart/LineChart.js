import style from "./Chart.module.css";
import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";

//Sử dụng useEffect để tạo biểu đồ khi component được render.
//Sử dụng const để khai báo các biến.
//Thêm một options object để tùy chỉnh trục y của biểu đồ.

function LineChart({ emotionsData, commentsData }) {
  const [chart, setChart] = useState(null)
  
  useEffect(() => {
    let like = []
    let dislike = []
    let cmt = []
    const bienx = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ]
    if (emotionsData != undefined) {
      if (Array.isArray(emotionsData) === true) {
        emotionsData.shift()
        emotionsData.forEach(element => {
          like.push(element.likeCount[0])
          dislike.push(element.dislikeCount[0])
        })
      }
    }
    if (commentsData != undefined) {
      if (Array.isArray(commentsData) === true) {
        commentsData.forEach(comment => {
          cmt.push(comment.count)
        })
      }
    }
    const CHART = document.getElementById("linechart").getContext("2d")
    if (chart) {
      chart.destroy()
    }
    const lineChart = new Chart(CHART, {
      type: "line",
      data: {
        labels: bienx,
        datasets: [
          {
            label: "like",
            data: like,
            backgroundColor: "'rgba(0, 0, 0, 0.1)'",
            borderColor: "rgba(0, 0, 0, 0.9)",
            borderWidth: 0.5,
            tension: 0.2,
          },
          {
            label: "dislike",
            data: dislike,
            backgroundColor: "blue",
            borderColor: "blue",
            borderWidth: 1,
            tension: 0.4,
          },
          {
            label: "comment",
            data: cmt,
            backgroundColor: "green",
            borderColor: "green",
            borderWidth: 1,
            tension: 0.4,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      },
    });
    setChart(lineChart)
  }, [emotionsData, commentsData])

  return (
    <div className={style.containerLinechart}>
      <canvas id="linechart"></canvas>
    </div>
  )
}

export default LineChart
