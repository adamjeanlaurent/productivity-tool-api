import { Nullable } from './types';

export enum FeatureId {
    
}

const features: Map<FeatureId, boolean> = new Map<FeatureId, boolean>([

]);

export const isFeatureEnabled = (featureId: FeatureId): Nullable<boolean> => {
    return (features.get(featureId));
}