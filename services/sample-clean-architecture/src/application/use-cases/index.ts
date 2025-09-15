import { UseCaseReponse } from './response.js';

export interface IUseCase<UseCaseInput, UseCaseData> {
  execute(input: UseCaseInput): Promise<UseCaseReponse<UseCaseData>>;
}

export * from './user/add-user.use-case.js';
export * from './user/get-all-users.use-case.js';
export * from './user/get-user-by-id.use-case.js';
export * from './user/update-user.use-case.js';
export * from './user/delete-user.use-case.js';

export * from './post/add-post.use-case.js';
export * from './post/get-all-posts.use-case.js';
export * from './post/get-post-by-id.use-case.js';
export * from './post/update-post.use-case.js';
export * from './post/delete-post.use-case.js';
