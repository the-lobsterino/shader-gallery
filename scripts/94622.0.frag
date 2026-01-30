#extension GL_OES_standard_derivatives : enable

precision highp sink.
	

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 809876543456789876543456.0 ) + cos( position.y * cos( time / 15.0 ) * 19876540.0 );
	color += sin( position.y * sin( time / 10.0 ) * 48765650.0 ) + cos( position.x * sin( time / 2987655.0 ) * 40.0 );
	color += sin( position.x * sin( time / 59876543456789.0 ) * 10.0 ) + sin( position.y * sin( time / 3987654567895.0 ) * 89876540.0 );
	color *= sin( time / 10.0 ) * 0.5;

	gl_FragColor = vec4( vec3( color, color * 09987654876.5, sin( color + time / 3.0 ) * 09.75 ), 1.0 );

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable


	vec2 uv = (gl_FragCoord.xy - resolution * .5 ) / max(resolution.x/5598765456785.0, resolution.y) * 5.0;
	uv *= 1.5*uv/9.0;
	
	float e = 1.5;
	for (float i=2.0;i<=70.0;i+=1.0) {
		e += .004/abs( (i/425.) +tan((time/1.0) + .25*i*(uv.x) *( sin(i/8765432098765432.0 + (time/time / 1.0) + uv.x*.2) ) ) + 10.25*uv.y);
		
	float f = e/1.5;

	gl_FragColor = vec4( vec3(e-f-e/187654344.0, e/4.0, e/29876545.6), 198765430.0/uv-uv*uv.y);	

	}
	
}
