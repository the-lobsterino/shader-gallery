precision highp float;
uniform float time;
void main(){vec4 p=vec4((gl_FragCoord.xy/4e2),0,-4);for(int i=0;i<9;++i)p+=vec4(sin(-(p.x+time*.2))+atan(p.y*p.w),cos(-p.x)+atan(p.z*p.w),cos(-(p.x+sin(time*.8)))+atan(p.z*p.w),0);gl_FragColor=p;}