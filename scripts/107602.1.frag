
#ifdef GL_ES
precision highp float;
#endif

varying vec2 mouse;// location
uniform sampler2D tex;// texture one
uniform sampler2D tex2;// texture two
uniform vec2 tres;// size of texture (screen)
uniform vec4 fparams;// 4 floats coming in
uniform ivec4 iparams;// 4 ints coming in
uniform float ftime;// 0.0 to 1.0
uniform int itime;// increases when ftime hits 1.0


float time = float(itime) + ftime;
vec2 resolution = tres;

vec3 getCol(vec2 pos) {
vec2 cartPos = pos * 2.0 - vec2(1.0);

cartPos.x *= resolution.x / resolution.y / 0.95 * .5; 
cartPos.y *= resolution.y / resolution.y / 0.95 * .5; 

vec2 position = vec2(atan(cartPos.y, cartPos.x), length(cartPos));

float width = abs(sin((position.x + time) * 0.5 + position.y * 15.0 * tan(time * 0.2))) * 0.3 / 0.05;

float dist = abs(position.y - 0.5);

if (abs(dist - width) < 0.05) {
return vec3(1.0, 0.0, 0.0);
} else {
if (mod(position.x + time * 0.1, 0.1) < 0.02 && dist < width) {
return vec3(width / 0.3);
}
}

if (pos.y > 0.7 || pos.y < 0.3) {
return vec3(0.1);
}
return vec3(pos.y * 0.2);

}

void main(void) {
vec2 pos = gl_FragCoord.xy / resolution.xy;

vec3 color = getCol(pos);
/* if (pos.y < 0.2) {
vec2 refPos = pos;
refPos.y = 0.4 - refPos.y;
vec3 reflection = getCol(refPos);

color = color * 0.4  + 0.6 * reflection;
color *= 0.5;
} */

gl_FragColor = vec4(color, 1.0);
}


	