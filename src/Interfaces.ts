export enum ResponseStatus {
  OK = "OK",
}

export enum ResourceStatus {
  ACTIVE = "ACTIVE",
}

export interface ImageObject {
  type: string;
  url: string;
  md5: string;
  width: number;
  height: number;
  uploadedDate: string;
}

export interface SellerObject {
  id: string;
  owner: string;
  status: ResourceStatus;
  financeCheckExempted: boolean;
  name: string;
  supportEmail?: string;
  supportPhoneNumber?: string;
  website?: string;
  facebook?: string;
  twitter?: string;
  blog?: string;
  otherLink?: string;
}

export interface CategoryObject {
  path: string;
  name: string;
}

export interface ReleaseObject {
  id: string;
  appId: string;
  compatibleApps: string[];
  platform: string[];
  dateAdded: string;
  releaseNote: string;
  versionTitle: string;
}

export interface PlatformObject {
  key: string;
  value: string;
}

export interface RatingObject {
  targetId: string;
  averageRating: number;
  rating5: number;
  rating4: number;
  rating3: number;
  rating2: number;
  rating1: number;
  legacyRatingNum: number;
  total: number;
  rating5Percent: number;
  rating4Percent: number;
  rating3Percent: number;
  rating2Percent: number;
  rating1Percent: number;
}

export interface ResourceObject {
  id: string;
  catalogItemId: string;
  namespace: string;
  title: string;
  recurrence: string;
  currencyCode: string;
  priceValue: number;
  keyImages: ImageObject[];
  effectiveDate: string;
  seller: SellerObject;
  description: string;
  technicalDetails: string;
  longDescription: string;
  isFeatured: boolean;
  isCatalogItem: boolean;
  categories: CategoryObject[];
  bundle: false;
  releaseInfo: ReleaseObject[];
  platforms: PlatformObject[];
  compatibleApps: string[];
  urlSlug: string;
  purchaseLimit: number;
  tax: number;
  tags: number[];
  commentRatingId: string;
  ratingId: string;
  klass: string;
  isNew: boolean;
  free: boolean;
  discounted: boolean;
  featured: string;
  thumbnail: string;
  learnThumbnail: string;
  headerImage: string;
  status: ResourceStatus;
  ownedCount: number;
  canPurchase: boolean;
  owned: boolean;
  price: string;
  discount?: string | null;
  discountPrice?: string | null;
  rating: RatingObject;
  // reviewed: boolean;
}

export interface PagingObject {
  count: number;
  start: number;
  total: number;
}

export interface ResponseData {
  elements: ResourceObject[];
  paging: PagingObject;
}

export interface ResponseJSON {
  status: ResponseStatus;
  data: {
    elements: ResourceObject[];
  };
}

export enum CheckType {
  MONTHLY = "MONTHLY",
  PERM = "PERM_FREE",
}
