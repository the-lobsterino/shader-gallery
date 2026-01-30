#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float plot(vec2 st) {    
    return smoothstep(0.02, 0.0, abs(st.y - st.x));
}
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.0;
	color += sin( position.x * cos( time / 15.0 ) * 80.0 ) + cos( position.y * cos( time / 15.0 ) * 10.0 );
	color += sin( position.y * sin( time / 10.0 ) * 40.0 ) + cos( position.x * sin( time / 25.0 ) * 40.0 );
	color += sin( position.x * sin( time / 5.0 ) * 10.0 ) + sin( position.y * sin( time / 35.0 ) * 80.0 );
	color *= sin( time / 10.0 ) * 0.5;

	vec2 st = gl_FragCoord.xy/resolution;

    float y = st.x;

    vec3 color2= vec3(y); 
    // Plot a line
    float pct = plot(st);
    color2 = (1.0-pct)*color2+pct*vec3(0.0,1.0,0.0);

	gl_FragColor = vec4(color2,1.0);

}