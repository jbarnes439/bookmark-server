function makeBookmarksArray() {
  return [
    {
      id: 1,
      title: 'First Bookmark',
      url: 'www.bookmark.com',
      description: 'first bookmark description',
      rating: 1
    },
    {
      id: 2,
      title: 'Second Bookmark',
      url: 'www.google.com',
      description: 'finds all the answers',
      rating: 5
    },
  ];
}

module.exports = {
  makeBookmarksArray,
}