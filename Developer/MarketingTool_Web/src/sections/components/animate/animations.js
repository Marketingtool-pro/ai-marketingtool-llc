// @project
import { getRadiusStyles } from '@/utils/getRadiusStyles';

export const inViewAnimations = {
  Slide: ['slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight', 'slideOutUp', 'slideOutDown', 'slideOutLeft', 'slideOutRight'],
  Fade: [
    'fadeIn',
    'fadeInUp',
    'fadeInDown',
    'fadeInLeft',
    'fadeInRight',
    'fadeOut',
    'fadeOutUp',
    'fadeOutDown',
    'fadeOutLeft',
    'fadeOutRight'
  ],
  Zoom: [
    'zoomIn',
    'zoomInUp',
    'zoomInDown',
    'zoomInLeft',
    'zoomInRight',
    'zoomOut',
    'zoomOutUp',
    'zoomOutDown',
    'zoomOutLeft',
    'zoomOutRight'
  ],
  Bounce: [
    'bounceIn',
    'bounceInUp',
    'bounceInDown',
    'bounceInLeft',
    'bounceInRight',
    'bounceOut',
    'bounceOutUp',
    'bounceOutDown',
    'bounceOutLeft',
    'bounceOutRight'
  ],
  Flip: ['flipInX', 'flipInY', 'flipOutX', 'flipOutY'],
  Scale: ['scaleInX', 'scaleInY', 'scaleOutX', 'scaleOutY'],
  Rotate: ['rotateIn', 'rotateOut']
};

export const groupedAnimations = {
  Slide: ['slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight'],
  Fade: ['fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight'],
  Zoom: ['zoomIn', 'zoomInUp', 'zoomInDown', 'zoomInLeft', 'zoomInRight'],
  Bounce: ['bounceIn', 'bounceInUp', 'bounceInDown', 'bounceInLeft', 'bounceInRight'],
  Flip: ['flipInX', 'flipInY'],
  Scale: ['scaleInX', 'scaleInY'],
  Rotate: ['rotateIn']
};

export function applyBorderWithRadius(radius, theme) {
  return {
    overflow: 'hidden',
    '--Grid-borderWidth': '1px',
    borderTop: 'var(--Grid-borderWidth) solid',
    borderLeft: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
    '& > div': {
      overflow: 'hidden',
      borderRight: 'var(--Grid-borderWidth) solid',
      borderColor: 'divider',
      [theme.breakpoints.down('md')]: {
        '&:nth-of-type(1)': getRadiusStyles(radius, 'topLeft'),
        '&:nth-of-type(2)': getRadiusStyles(radius, 'topRight'),
        '&:nth-of-type(3)': getRadiusStyles(radius, 'bottomLeft'),
        '&:nth-of-type(4)': getRadiusStyles(radius, 'bottomRight'),
        borderTop: 'var(--Grid-borderWidth) solid',
        borderColor: 'divider'
      },
      [theme.breakpoints.up('md')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'bottomLeft'),
        '&:last-of-type': getRadiusStyles(radius, 'topRight', 'bottomRight')
      }
    }
  };
}
