#ifdef GL_ES
precision mediump float;
#endif
uniform float time;uniform vec2 mouse,resolution;void main(){vec3 _1=vec3(1.0),C
=vec3(80.0,40.0,10.0);vec2 p=gl_FragCoord.xy/resolution+mouse/4.0;float c=(dot(
sin(p.xyx*cos(time/vec3(15.0,10.0,5.0))*C),_1)+dot(sin(p.yxy*cos(time/vec3(15.0,
25.0,35.0))*C.zyx),_1))*sin(time/10.0)*0.5; gl_FragColor=vec4(vec3(c,c*0.5,sin(c
+time/3.0)*0.75),1.0);}