#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float id(float i){
	return i;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec2 v = vec2(.0);
	vec2 p = position*1.0;
	//p = sin(position*5.);
	//p *= 10.;
        //p = mod(position,.5);	
	for(float i = .0; i<6.0;i++){
	    vec2 po = p;
	    p.x += sin( 2.178*po.y ) - id(cos( 3.392*po.x ));
	    p.y += sin( (5.936+sin(time)*.1)*po.x ) - id(cos( (7.194+sin(time*.1)*.5)*po.y ));
            p -= .5;
	}

	float d = distance(p, position);
	//gl_FragColor = vec4( vec3( p.y-p.x ), 1.0 );
	gl_FragColor = vec4( vec3( 5.-d ), 1.0 );

}