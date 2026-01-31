#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 eyePosition;
uniform vec3 lightPosition;

const vec3 purple = vec3(0.2, 0.6, 0.8);

float pos_transform(vec2 position, float driver) {
	return sin( position.x * cos( driver / 15.0 ) * 80.0 ) + cos( position.y * cos( driver / 15.0 ) * 10.0 );
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy / 2. ) - mouse / 4.0;
	vec3 normal = vec3(0,0,0);
	vec3 n = normalize(normal);
//        vec3 l = normalize(lightPosition - position);
  //      vec3 e = normalize(position - eyePosition);
        //vec3 r = reflect(l, n);


	
	float color = 0.0;
	color += pos_transform(p, time);
	//color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	//color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	//color *= sin( time / 10.0 ) * 0.5;
        float radius = .2;
        float distance = length(p);
        if (distance < radius) {
            color = pos_transform(-p, time);
        }
	
	gl_FragColor = vec4( vec3( color, color * 0.5, sin( color / 3.0 ) * 0.75 ), 1.0 );

}
