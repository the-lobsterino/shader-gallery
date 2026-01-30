#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


//==============================================================
// otaviogood's noise from https://www.shadertoy.com/view/ld2SzK
//--------------------------------------------------------------
// This spiral noise works by successively adding and rotating sin waves while increasing frequency.
// It should work the same on all computers since it's not based on a hash function like some other noises.
// It can be much faster than other noise functions if you're ok with some repetition.
//
// * Modified to 2D
// Returns values roughly in the -1 to 1 range.
const float nudge = 2.;	// size of perpendicular vector
const float normalizer = 1.0 / sqrt(1.0 + nudge*nudge);	// pythagorean theorem on that perpendicular to maintain scale
float SpiralNoiseC(vec2 p)
{
    float n = 1.;
    float freq = 2.0;
    for (int i = 0; i < 8; i++)
    {
        // add sin and cos scaled inverse with the frequency
        n += -abs(sin(p.y*freq) + cos(p.x*freq)) / freq;	// abs for a ridged look
        // rotate by adding perpendicular and scaling down
        p.xy += vec2(p.y, -p.x) * nudge;
        p.xy *= normalizer;
        // increase the frequency
        freq *= 1.733733;
    }
    return n;
}



void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position -= vec2(.5);
	position *= 139999999.;
		
	//position += mouse;

	float color = 0.5+0.5*SpiralNoiseC(position * (1.-mouse.y)*10. + SpiralNoiseC(position * 10.1));

	gl_FragColor = vec4( vec3( color /*, color * 0.5, sin( color  ) * 0.75 */), 1.0 );

}