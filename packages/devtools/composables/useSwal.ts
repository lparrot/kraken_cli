import Swal from 'sweetalert2'

export function useSwal() {
  // update default options
  return Swal.mixin({
    allowOutsideClick: false,
    reverseButtons: true,
  })
}
