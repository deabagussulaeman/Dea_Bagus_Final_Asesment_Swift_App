import client from '@app/services/api';
import {
  GET_BLOG_BY_FILTER,
  GET_BLOG_CATEGORY,
} from '@app/_modules/blog_list/services/schema';

const filters = {
  withoutFilter: {
    page_size: 3,
    currentPage: 1,
  },
  withFilter: {
    categoryId: 0,
  },
};

const sampleBlogCategory = {
  data: {
    getBlogCategory: {
      __typename: 'GetBlogCategory',
    },
  },
};

const data = [
  expect.objectContaining(
    {
      __typename: 'BlogList',
      title: 'Bakso Sapi Super Kenyal',
      url_key: 'bakso-resep',
      id: 3,
    },
    {
      __typename: 'BlogList',
      title: 'Gimana sih cara buat bakso?',
      url_key: 'bakso-blog',
      id: 2,
    },
  ),
];

const sampleBlogFilter = {
  data: {
    getBlogByFilter: {
      __typename: 'GetBlogByFilter',
      items: expect.arrayContaining(data),
      page_size: expect.any(Number),
    },
  },
};

// [Tes menggunakan data expect string given]
test('Should pass if get blog category data by api', () => {
  return expect(
    client.query({query: GET_BLOG_CATEGORY}),
  ).resolves.toMatchObject(sampleBlogCategory);
});

// [Tes menggunakan data expect array of object given]
test('Should pass with filter provided get blog by filter data using api', () => {
  return expect(
    client.query({query: GET_BLOG_BY_FILTER, variables: filters.withFilter}),
  ).resolves.toMatchObject(sampleBlogFilter);
});

test('Should get error with no filters provided', () => {
  return expect(
    client.query({query: GET_BLOG_BY_FILTER, variables: filters.withoutFilter}),
  ).rejects.toThrow(/id, category_id, or url_key must be provided on filters/);
});
