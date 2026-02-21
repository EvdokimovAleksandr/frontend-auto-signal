type NavigateFn = (path: string) => void

let navigateRef: NavigateFn | null = null

export const setNavigate = (n: NavigateFn | null) => {
  navigateRef = n
}

export const navigateTo = (path: string) => {
  navigateRef?.(path)
}
