#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float drawRect(vec2 st, float _left, float _top, float _width, float _height){
	//Left Bottom
    float left = step(_left,st.x);
    float bottom = step(1.0 - _top - _height, st.y);
    float right = step(1.0-(_left + _width), 1.0-st.x);
    float top = step(_top, 1.0-st.y);
    
	float pct = left*bottom*right*top;
	//float pct = left * bottom * right * top;
	return pct;
}

void main( void ) {

    vec2 st = gl_FragCoord.xy/resolution.xy;
    vec3 color = vec3(0.0);

    float val1 = 0.02;
    
    //Red
    float pct = drawRect(st, val1, val1, 0.1, 0.2);
    color = vec3(pct,0.0,0.0);
    
    pct = drawRect(st, 0.14, val1, 0.2, 0.06);
    color += vec3(pct);
    
    pct = drawRect(st, 0.88, val1, 0.1, 0.1);
    color += vec3(pct,0.0,0.0);
	
    //White
    pct = drawRect(st, val1, 0.24, 0.1, 0.74);
    color += vec3(pct);

	pct = drawRect(st, 0.14, 0.10, 0.2, 0.38);
    color += vec3(pct);

	pct = drawRect(st, 0.36, 0.02, 0.3, 0.96);
    color += vec3(pct);
    
	pct = drawRect(st, 0.68, 0.24, 0.18, 0.64);
    color += vec3(pct);
	
    //Yellow
    pct = drawRect(st, 0.68, 0.9, 0.18, 0.08);
    color += vec3(pct,pct,0.);
    
    //Green
    pct = drawRect(st, 0.68, val1, 0.18, 0.2);
    color += vec3(pct,0.,0.);
    
	pct = drawRect(st, 0.88, 0.14, 0.1, 0.84);
    color += vec3(pct);

    //Blue
	pct = drawRect(st, 0.14, 0.50, 0.2, 0.48);
    color += vec3(0.,0.,pct*0.7);   

    gl_FragColor = vec4(color,1.0);


}