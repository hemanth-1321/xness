import { useEffect, useRef, useCallback } from 'react'
import { createChart, IChartApi, ISeriesApi, CandlestickData } from 'lightweight-charts'

interface CandleData {
  time: number
  open: number
  high: number
  low: number
  close: number
}

interface UseChartProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  onCrosshairMove?: (price: string, time: string) => void
}

export const useChart = ({ containerRef, onCrosshairMove }: UseChartProps) => {
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  const initializeChart = useCallback(() => {
    if (!containerRef.current || chartRef.current) return

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: '#1e293b' },
        textColor: '#e2e8f0',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#fbbf24',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: '#fbbf24',
          width: 1,
          style: 2,
        },
      },
      rightPriceScale: {
        borderColor: '#334155',
        textColor: '#e2e8f0',
      },
      timeScale: {
        borderColor: '#334155',
        timeVisible: true,
        secondsVisible: false,
      },
    })

      //@ts-ignore
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })

    chartRef.current = chart
    seriesRef.current = candlestickSeries

    // Handle crosshair move
    if (onCrosshairMove) {
      chart.subscribeCrosshairMove((param) => {
        if (param.time && param.seriesData.get(candlestickSeries)) {
          const data = param.seriesData.get(candlestickSeries) as CandlestickData
          if (data) {
            const date = new Date((param.time as number) * 1000)
            onCrosshairMove(
              data.close?.toFixed(5) || '',
              date.toLocaleString()
            )
          }
        }
      })
    }

    // Handle resize
    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [containerRef, onCrosshairMove])

  const updateData = useCallback((data: CandleData[]) => {
    if (seriesRef.current && data.length > 0) {
      const chartData = data.map(candle => ({
        time: candle.time as any,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
      }))
      seriesRef.current.setData(chartData)
    }
  }, [])

  const clearData = useCallback(() => {
    if (seriesRef.current) {
      seriesRef.current.setData([])
    }
  }, [])

  const fitContent = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }, [])

  useEffect(() => {
    const cleanup = initializeChart()
    return cleanup
  }, [initializeChart])

  return {
    chart: chartRef.current,
    series: seriesRef.current,
    updateData,
    clearData,
    fitContent,
  }
}
