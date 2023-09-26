document.addEventListener("DOMContentLoaded", function () {
  const itemsPerPage = 4;
  const totalItems = 16; // Assuming you have 16 items in total
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const cardHtml = `
            <a href="/video">
                <div class="card">
                    <h1>${window.videoTitle}</h1>
                    <img src="/img/landen_thumbnail.png" alt="Video Thumbnail {{id ofzo}}" />
                </div>
            </a>
    `;
  const contentContainer = document.getElementById("content");
  const paginationContainer = document.getElementById("pagination");

  function showPage(pageNumber) {
    contentContainer.innerHTML = ""; // Clear existing content

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    for (let i = startIndex; i < endIndex && i < totalItems; i++) {
      const item = document.createElement("div");
      item.classList.add("column");
      item.classList.add("col-6");
      item.classList.add("col-md-12");

      item.innerHTML = cardHtml;
      contentContainer.appendChild(item);
    }
  }

  function createPagination() {
    for (let i = 1; i <= totalPages; i++) {
      const pageItem = document.createElement("li");
      pageItem.classList.add("page-item");
      const pageLink = document.createElement("a");
      pageLink.classList.add("page-link");
      pageLink.href = "#";
      pageLink.textContent = i;
      pageLink.addEventListener("click", function (event) {
        event.preventDefault();
        showPage(i);
      });
      pageItem.appendChild(pageLink);
      paginationContainer.appendChild(pageItem);
    }
  }

  showPage(1); // Display the first page by default
  createPagination();
});
