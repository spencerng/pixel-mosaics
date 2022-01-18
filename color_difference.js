// Code from https://stackoverflow.com/questions/13586999/color-difference-similarity-between-two-values-with-js
function deltaE(t,a){let r=rgb2lab(t),h=rgb2lab(a),M=r[0]-h[0],o=r[1]-h[1],b=r[2]-h[2],l=Math.sqrt(r[1]*r[1]+r[2]*r[2]),n=l-Math.sqrt(h[1]*h[1]+h[2]*h[2]),p=o*o+b*b-n*n,w=M/1,e=n/(1+.045*l),q=(p=p<0?0:Math.sqrt(p))/(1+.015*l),s=w*w+e*e+q*q;return s<0?0:Math.sqrt(s)}function rgb2lab(t){let a,r,h,M=t[0]/255,o=t[1]/255,b=t[2]/255;return r=(.2126*(M=M>.04045?Math.pow((M+.055)/1.055,2.4):M/12.92)+.7152*(o=o>.04045?Math.pow((o+.055)/1.055,2.4):o/12.92)+.0722*(b=b>.04045?Math.pow((b+.055)/1.055,2.4):b/12.92))/1,h=(.0193*M+.1192*o+.9505*b)/1.08883,a=(a=(.4124*M+.3576*o+.1805*b)/.95047)>.008856?Math.pow(a,1/3):7.787*a+16/116,[116*(r=r>.008856?Math.pow(r,1/3):7.787*r+16/116)-16,500*(a-r),200*(r-(h=h>.008856?Math.pow(h,1/3):7.787*h+16/116))]}