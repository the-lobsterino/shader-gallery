///////////////SPEEDHEAD OF BYTERAPERS///////greetings to ANDROMEDA
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
mat2 rotate2d(float angle){return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));}
void amiga500(){vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);if(time>4.)uv = rotate2d((time*2.)*3.14)*uv;
vec3 dc=vec3(uv,2.* sin(time*0.01));vec3 c=vec3(0.59,0.52*cos(time*0.17),0.6+0.2*cos(time*0.21));
for (int i = 0;i<3; i++)dc.zxy = sin(abs(dc) / dot(dc, dc)) - c;dc = dot(dc, vec3(0.33)) + dc.yzx * vec3(1.0, 0.1, 0.1);
gl_FragColor=vec4(dc*2.2,0.75);}
void main(){amiga500();}