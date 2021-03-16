import { ButtonProps } from '@material-ui/core';
import { ReactElement } from 'react';

type Color = ButtonProps['color'];

type maxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

export interface DialogOptions {
  className?: string;
  title?: string;
  message?: string;
  element?: ReactElement;
  okColor?: Color;
  cancelColor?: Color;
  hideOk?: boolean;
  hideCancel?: boolean;
  okText?: string;
  cancelText?: string;
  onOk?: () => void;
  onCancel?: () => void;
  fullWidth?: boolean;
  fullScreen?: boolean;
  maxWidth?: maxWidth;
}

export const DEFAULT_DIALOG_OPTIONS: DialogOptions = {};

export interface MessageOptions {
  className?: string;
  title?: string;
  message?: string;
  element?: ReactElement;
  color?: Color;
  okText?: string;
  onOk?: () => void;
  fullWidth?: boolean;
  fullScreen?: boolean;
  maxWidth?: maxWidth;
}

export interface AlertOptions {
  className?: string;
  title?: string;
  message?: string;
  element?: ReactElement;
  color?: Color;
  fullWidth?: boolean;
  fullScreen?: boolean;
  maxWidth?: maxWidth;
}
