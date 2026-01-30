#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;




// wrong axis!!!!!!






float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

mat3 setCamera( in vec3 ro, in vec3 ta, float cr )
{
	vec3 cw = normalize(ta-ro);
	vec3 cp = vec3(sin(cr), cos(cr),0.0);
	vec3 cu = normalize( cross(cw,cp) );
	vec3 cv =          ( cross(cu,cw) );
    return mat3( cu, cv, cw );
}


vec3 render( in vec3 ro, in vec3 rd, in vec3 rdx, in vec3 rdy ){
	vec3 c = vec3(0);
	
	
	
	
	
	vec3 p = ro;
	for (int i=0;i<9;i++){
		float f = sdSphere(p-vec3(-15.0,-5.0,1.0),5.0);
		if (f < 0.01) {
			c = vec3(1,1,1);
		}
		else{
			p += rd * f;
		}
	}
	return c;
}
void main( void ) {
	 vec2 mo = mouse.xy/resolution.xy;
	float time2 = 32.0 + time*1.5;
	
	
	
	
    // camera	
    vec3 ta = vec3( 0.5, -0.8, -0.6 );
	float time = 0.0;
    vec3 ro = ta + vec3( 4.5*cos(0.1*time + 7.0*mo.x), 1.3 + 2.0*mo.y, 4.5*sin(0.1*time + 7.0*mo.x) );
    // camera-to-world transformation
    mat3 ca = setCamera( ro, ta, 0.0 );
	vec2 p = (2.0*gl_FragCoord.xy-resolution.xy)/resolution.y;

        const float fl = 2.5;
        
        // ray direction
        vec3 rd = ca * normalize( vec3(p,fl) );
	 // ray differentials
        vec2 px = (2.0*(gl_FragCoord.xy+vec2(1.0,0.0))-resolution.xy)/resolution.y;
        vec2 py = (2.0*(gl_FragCoord.xy+vec2(0.0,1.0))-resolution.xy)/resolution.y;
        vec3 rdx = ca * normalize( vec3(px,fl) );
        vec3 rdy = ca * normalize( vec3(py,fl) );
	vec3 col = render( ro, rd, rdx, rdy );
	
	
	
	
	
	gl_FragColor = vec4(col, 1);

}