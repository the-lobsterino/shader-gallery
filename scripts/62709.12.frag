#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi=3.141596;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) ;

	float color = 0.0;
	vec2 point[5];
	point[0] = vec2(0.0,0.2);
	point[1] = vec2(0.8,0.4);
	point[2] = vec2(0.5,0.8);
	point[3] = vec2(1.0,1.0);
	point[4] = vec2(0.1,1.0);
	
	float m_dist = 100.0;  // minimum distance
	float AMP = 0.4;
	vec2 pos = position;
	
   	for (int i = 0; i < 5; i++) 
	{
		float dist = distance(pos, point[i]);
                m_dist = min(m_dist, dist);
        }
	color += sin(m_dist*position.x*(50000.0)*(cos((time+pi*time)/360.0))+sin(time));
	float var;
	var += tan(m_dist*position.y*time*time*time*time*time*time*time);
	gl_FragColor = vec4( vec3(0.2*(var+color)+0.1*color/(var+color), 1.0-color, (1.0+var)/color), 1.0 );
}