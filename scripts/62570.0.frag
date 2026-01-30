/*
 * Original shader from: https://www.shadertoy.com/view/MdXGD2
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// --------[ Original ShaderToy begins here ]---------- //
vec2 rotate( vec2 inVec, float alpha )
{
	return vec2( 
		inVec.x * cos( alpha ) + inVec.y * sin( alpha ),
		inVec.y * cos( alpha ) - inVec.x * sin( alpha )
		);
}

float body( vec2 uv, vec2 leftLeg, vec2 rightLeg, vec2 center )
{
	float baseRadius = .18;
	vec2 leftLeg2 = leftLeg - center;
	vec2 rightLeg2 = rightLeg - center;
	float leftRadius = length( leftLeg2 );
	float rightRadius = length( rightLeg2 );
	vec2 leftDir = leftLeg2 / leftRadius;
	vec2 rightDir = rightLeg2 / rightRadius;
	vec2 r = uv - center;
	float lenUV = length( r );
	
	vec2 uvDir =  r / lenUV;
	float leftDist = length( uvDir - leftDir );
	float rightDist = length( uvDir - rightDir );
	float leftFactor = pow( max(1.0 - leftDist, .0 ), 3.0 );
	float rightFactor = pow( max(1.0 - rightDist, .0 ), 3.0 );
	float centerFactor = 1.0 - leftFactor - rightFactor;
	
	float radius = leftFactor * leftRadius + rightFactor * rightRadius + centerFactor * baseRadius;
	if( lenUV < radius )
		return .0;
	return 1.0;
}

vec2 getLegCenter( float angle )
{
	vec2 leftLegCenter = vec2( sin( angle ), 
							 max( cos( angle ), .0 ) );
	leftLegCenter = vec2( .4, .2) * leftLegCenter + vec2( -.0, -.6 );
	return leftLegCenter;
}

float leg( vec2 uv, vec2 legCenter )
{
	float angle = ( legCenter.y + .6 )* 1.5;
	vec2 diff = uv - legCenter;
	diff = rotate( diff, angle );
	diff.y *= 1.6;
	if( diff.y < .0 )
		
		diff.y *= 5.2;
	
	if( length( diff ) < 0.2 )
		return .0;
	return 1.0;
}

float head( vec2 diff )
{
	vec2 diff2 = rotate( diff, -.4 );
	diff2 = diff2 * vec2( 5.0, 7.0 );
	if( length( diff2 ) < 1.0 )
		return .0;
	return 1.0;
}

float walker( vec2 uv )
{
	
	float val = 1.0;
	
	if( uv.y < -.6 )
		val = 0.0;
	
	float progress = 6.66 * iTime;
	
	vec2 leftLegCenter = getLegCenter( progress );
	vec2 rightLegCenter = getLegCenter( progress  + 3.141592 );
	
	vec2 achillesOffset = vec2( -.15, .0 );
	
	vec2 bodyCenter = vec2( .0, -.05 + .1 * sin( progress * 2.0 ));
	vec2 headCenter = bodyCenter + vec2( .10 + .08 * cos( progress * 2.0 + .3), .23 );
	
	val *= leg( uv, leftLegCenter) * leg( uv, rightLegCenter );
	val *= body( uv, leftLegCenter + achillesOffset, rightLegCenter + achillesOffset, bodyCenter );
	val *= head( uv - headCenter );
	return val;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = fragCoord.xy / iResolution.xy - vec2( .5, .5 );
	uv.x *= iResolution.x / iResolution.y;
	uv *= 1.5;
	
	float walkerVal = walker( uv ); 
	float val = abs( walkerVal - walker( uv - vec2( .0, .01 )) );
	val += abs( walkerVal - walker( uv - vec2( .01, .0 )) );
	
	fragColor = vec4(val * vec3( 1.0, 1.0, 1.0 ),1.0);
	
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}