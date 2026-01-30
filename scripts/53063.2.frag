// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015
// dogshit edit 4 u

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
varying vec2 surfacePosition;
uniform float time;

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    //if (mod(time, 2.) > 1.0)
    //_st.x += step(1., mod(_st.y,2.0)) * time;
    //else
    //_st.y += step(1., mod(_st.x,2.0)) * time;
	
	_st.y += cos(time*0.5);
	_st.x += sin(time*0.5);

    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(1.5)-_size*1.5;
    vec2 uv = smoothstep(_size,_size+vec2(2e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(void){
	float time = time*0.5;
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    uv -= 0.5;
	
	vec2 p = uv;	
	
	uv.x *= resolution.x/resolution.y;
    vec3 color = vec3(0.0);
	
    //uv /= max(mix(0.1,0.5,0.0),dot(uv,uv));
    uv /= dot(uv,uv)+(0.5*sin(time)+0.5);

    // Modern metric brick of 215mm x 102.5mm x 65mm
    // http://www.jaharrison.me.uk/Brickwork/Sizes.html
    // uv /= vec2(2.15,0.65)/1.5;

    // Apply the brick tiling
    uv = brickTile(uv,6.0);

    color = vec3(box(uv,vec2(0.9)));
    color.bg *= sin(uv.x+uv.y);
	
    color *= 0.7-(length(p));	
	
    gl_FragColor = vec4(color,1.0);
}