export function frameLoading(elementId) {
    // set the loading state
    let rows = document.getElementById(elementId);

    if (rows === null) {
        return;
    }

    rows.querySelectorAll('td').forEach((column) => {
        const content = column.innerHTML
        column.innerHTML = '<span class="placeholder-table rounded-xs mb-0">' + content + '</span>'
    })
}