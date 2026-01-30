#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
//uniform vec2 resolution;

const float ZOOM = 7.0;
const int TIMES = 15;
const float SPEED = 5.0;

void main( void ) {

    vec2 pos = gl_FragCoord.xy / ZOOM;

    float dist;
    vec2 cd = (gl_FragCoord.xy) / ZOOM;

        for(int i = 0; i < TIMES; i++) {
            dist = distance(pos.x, pos.y);

            pos.x = pos.x + sin(pos.y * 0.1 + sin(dist)) + sin(time / SPEED) / 2.0 + mouse.x / 8.0;
            pos.y = pos.y - sin(pos.x * 0.01 - cos(dist)) - cos(time/SPEED) / 2.0 + mouse.y / 8.0;
        }

    vec3 col = vec3(cos(pos.x*0.2),sin(pos.y*0.3),sin(pos.x*0.1));
    if(col.r >= 0.6 || col.g >= 0.6 || col.b >= 0.6) {
	    col /= (col.r + col.g + col.b) / 3.0 + 1.2;
    }

    gl_FragColor = vec4(col, 1.0);
}