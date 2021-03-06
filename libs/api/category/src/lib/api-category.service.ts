import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from, map } from 'rxjs';

import { CategoryDocument, CategoryRequest } from '@wfh/api-interfaces';
import { handleError } from '@wfh/api/util';

import { CategoryModel } from './api-category.schema';

@Injectable()
export class ApiCategoryService {
  constructor(
    @InjectModel(CategoryModel.name)
    private readonly categoryModel: Model<CategoryDocument>
  ) {}

  autocomplete(searchTerm: string) {
    return from(
      this.categoryModel.aggregate([
        {
          $search: {
            autocomplete: {
              query: searchTerm,
              path: 'name',
            },
          },
        },
        {
          $project: {
            name: 1,
          },
        },
      ])
    ).pipe(handleError('category'));
  }

  getAll() {
    return from(this.categoryModel.find({})).pipe(handleError('category'));
  }

  get(id: string) {
    return from(this.categoryModel.findById(id)).pipe(
      map((category) => {
        if (!category) {
          throw new NotFoundException();
        }
        return category;
      }),
      handleError('category')
    );
  }

  create(categoryReq: CategoryRequest) {
    return from(this.categoryModel.create(categoryReq)).pipe(handleError('category'));
  }

  update(id: string, categoryReq: Partial<CategoryRequest>) {
    return from(this.categoryModel.findByIdAndUpdate(id, categoryReq, { new: true })).pipe(
      map((category) => {
        if (!category) {
          throw new NotFoundException();
        }
        return category;
      }),
      handleError('category')
    );
  }

  delete(id: string) {
    return from(this.categoryModel.findByIdAndDelete(id)).pipe(
      map((category) => {
        if (!category) {
          throw new NotFoundException();
        }
        return category;
      }),
      handleError('category')
    );
  }
}
