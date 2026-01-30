
//信号機点滅

#ifdef GL_ES

precision mediump float;

#endif

 

uniform float time;

uniform vec2 mouse;

uniform vec2 resolution;

 

const vec3 white = vec3(1.0, 1.0, 1.0);

const vec3 red   = vec3(1.0, 0.0, 0.0);

const vec3 green = vec3(0.0, 1.0, 0.0);

const vec3 yellow  = vec3(1.0, 1.0, 0.0);

 

bool inCircle(vec2 position, vec2 offset, float size) {

    float len = length(position - offset);

    if (len < size) {

        return true;

    }

    return false;

}

 

 

void main( void ) {

    vec3 destColor = white;

    vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    if (inCircle(position, vec2(-0.5, 0.0), 0.2)&& fract(sin(time)) > 0.6) {

        destColor *= green;

    }

    if (inCircle (position,vec2(0.0,0.0),0.2) && fract(sin(time)) > 0.4) {

        destColor *= yellow;

    }

 

    if (inCircle (position, vec2( 0.5, 0.0), 0.2)&& fract(sin(time)) > 0.2) {

        destColor *= red;

    }

   

    gl_FragColor = vec4(destColor, 1.0);

}