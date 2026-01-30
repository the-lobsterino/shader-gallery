// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    if (mod(time, 4.) > 2.0) {
    	if (mod(time, 2.) > 1.0)
    	_st.x += step(1., mod(_st.y,2.0)) * time;
    	else
    	_st.y += step(1., mod(_st.x,2.0)) * time;
    }
    else {
    	if (mod(time, 2.) > 1.0)
    	_st.x -= step(1., mod(_st.y,2.0)) * time;
    	else
    	_st.y -= step(1., mod(_st.x,2.0)) * time;
    }

    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(void){
    vec2 uv = (gl_FragCoord.xy/resolution.y) - 0.5 * vec2(resolution.x/resolution.y, 1.0);
	vec3 color = vec3(0.0);

    // Modern metric brick of 215mm x 102.5mm x 65mm
    // http://www.jaharrison.me.uk/Brickwork/Sizes.html
    // uv /= vec2(2.15,0.65)/1.5;

    // Apply the brick tiling
    uv = brickTile(uv,5.0);

    color = vec3(box(uv,vec2(0.9)));

    // Uncomment to see the space coordinates
    //color = vec3(0., uv);

   gl_FragColor = vec4(color,1.0);
}