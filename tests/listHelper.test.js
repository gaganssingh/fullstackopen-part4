const listHelper = require("../utils/list_helper");
const helper = require("./test_helper");

test.skip("dummy returns one", () => {
   const blogs = [];

   const result = listHelper.dummy(helper.listWithOneBlog);
   expect(result).toBe(1);
});

describe.skip("total likes", () => {
   test("when list has only one blog equals to the likes of that", () => {
      const result = listHelper.totalLikes(helper.listWithOneBlog);
      expect(result).toBe(5);
   });

   test("when list had more than one blog and total likes equal 36", () => {
      const result = listHelper.totalLikes(helper.initialBlogs);
      expect(result).toBe(36);
   });

   test("when passed more than one blog, blog with most number of likes is returned", () => {
      const result = listHelper.favoriteBlog(helper.initialBlogs);
      const expectedResult = {
         title: "Canonical string reduction",
         author: "Edsger W. Dijkstra",
         likes: 12,
      };
      expect(result).toEqual(expectedResult);
   });

   // test("mostBlogs");
   // test("mostLikes");
});
