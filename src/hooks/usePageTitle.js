import { useEffect } from 'react'

const APP_NAME = 'PitchKu'

export const usePageTitle = (title) => {
  useEffect(() => {
    document.title = `${APP_NAME} | ${title}`
    return () => {
      document.title = APP_NAME
    }
  }, [title])
}