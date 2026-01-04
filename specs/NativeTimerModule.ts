import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  readonly start: () => void;
  readonly stop: () => void;
  readonly reset: () => void;
  readonly getElapsedTime: () => number;
  readonly getFormattedTime: () => string;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeTimerModule',
);