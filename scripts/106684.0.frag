///////////////////////////////////////////////////////////////////////////////
// advanced chessboard pattern with lens distortion
///////////////////////////////////////////////////////////////////////////////

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

////////////////////////////////////////////////////////////
// lens distortion coefficients ...
////////////////////////////////////////////////////////////

// values from: http://alumni.media.mit.edu/~sbeck/results/Distortion/distortion.html
float k1 = 0.0;//1.105763E-01 ;
float k2 = 0.0;//1.886214E-01 ;
float k3 = 0.0;//1.473832E-01 ;

float p1 = 0.0;//-8.448460E-02 ;
float p2 = 0.0;//-7.356744E-02 ;

float block = 32.;

#define SHOW_COLOR 1


////////////////////////////////////////////////////////////
// global variables, from outside of shader
////////////////////////////////////////////////////////////
// uniform float time; // not in use
// uniform vec2 mouse; // not in use
uniform vec2 resolution;


////////////////////////////////////////////////////////////
// determine color
////////////////////////////////////////////////////////////
vec3 GetChessboardColor(vec2 pos)
{
	vec3 color = vec3(0., 0., 0.);
	
	float block_idx_i = floor(resolution.x * pos.x / block);
	float block_idx_j = floor(resolution.y * pos.y / block);
	
	////////////////////////////////////////
	// "black" part
	////////////////////////////////////////
	if (	(mod(block_idx_i, 2.) == 0. && mod(block_idx_j, 2.) == 1.) ||
		(mod(block_idx_i, 2.) == 1. && mod(block_idx_j, 2.) == 0.) )
	{
		// do nothing
	}
	
	////////////////////////////////////////
	// "white" part - colored in two ways
	////////////////////////////////////////
	else {
		// simple white for chessboard
		color = vec3(1., 1., 1.);

		// advanced chess board pattern
#if SHOW_COLOR
		// red and green: show the pixel location
		float r = pos.x + 0.5;
		float g = pos.y + 0.5;
		
		// blue: show chessboard structure
		float b = 1.0;
		
		// pattern 1 : 
		if ( (mod(block_idx_i, 2.) == 0. &&
		      mod(block_idx_j, 2.) == 0.) )
		{
			b = 0.;
		}
		// pattern 2: inverted color (not in use)
		else
		{
//			r = 1.-r;
//			g = 1.-g;
		}

		color = vec3(r,g,b);
#endif
	}
	
	// out of range: GRAY
	if (pos.x < -0.5 || 0.5 < pos.x ||
	    pos.y < -0.5 || 0.5 < pos.y )
	{
		color.r = 0.75;
		color.g = 0.75;
		color.b = 0.75;
	}
		
	return color;
}

vec2 distort(vec2 pos_normalized)
{
	// pinhole camera assumption - image center
	vec2 r_ = pos_normalized;
	float r = dot(r_, r_);

	float x = pos_normalized.x;
	float y = pos_normalized.y;
	
	// 5-th order lens distortion model
	float r2 = r * r;
	float r4 = r2*r2;
	float r6 = r2*r4;
	float x2 = x * x;
	float y2 = y * y;
	float xy = x * y;
	
	float K = k1 * r2 + k2 * r4 + k3 * r6;
	
	x += x * K + p2 * (r2 + 2. * x2) + 2. * p1 * xy;
	y += y * K + p1 * (r2 + 2. * y2) + 2. * p2 * xy;
	
	return vec2(x,y);
}

vec2 undistort(vec2 pos_normalized)
{
	// pinhole camera assumption - image center
	vec2 r_ = pos_normalized;
	float r = dot(r_, r_);

	float x = pos_normalized.x;
	float y = pos_normalized.y;
	
	// 5-th order lens distortion model
	float r2 = r * r;
	float r4 = r2*r2;
	float r6 = r2*r4;
	float x2 = x * x;
	float y2 = y * y;
	float xy = x * y;
	
	// Based on this opinion (NOT SURE): https://stackoverflow.com/a/41495451
	float K = -k1 * r2 -k2 * r4 -k3 * r6;
	
	x += x * K - p2 * (r2 + 2. * x2) - 2. * p1 * xy;
	y += y * K - p1 * (r2 + 2. * y2) - 2. * p2 * xy;
	
	return vec2(x,y);
}


///////////////////////////////////////////////////////////////////////////////
// shader main routine
///////////////////////////////////////////////////////////////////////////////
void main( void ) {
	// gl_FragCoord.xy : in GL coordinate (LEFT BOTTOM is origin)
	// specify pixel: ( [0,resolution.x-1], [0,resolution.y-1] )

	// convert to WINDOW coordinate (LEFT TOP is origin)
	vec2 pos = vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y);
	vec2 pos_normalized = vec2(pos.x / resolution.x, pos.y / resolution.y);
	pos_normalized -= vec2(0.5, 0.5); // [+0.0:+1.0] -> [-0.5:+0.5]
	pos_normalized *= 1.05; // slightly larger than the original image area to certificate lens distortion on boundary
	
	vec2 pos_distorted = distort(pos_normalized);
//	vec2 pos_distorted = undistort(pos_normalized);
//	vec2 pos_distorted = pos_normalized; // for debug
	
	vec3 color = GetChessboardColor(pos_distorted);
	gl_FragColor = vec4( color, 1. );
	
	// out of range: DARK GRAY
	if (pos_normalized.x < -0.5 || 0.5 < pos_normalized.x ||
	    pos_normalized.y < -0.5 || 0.5 < pos_normalized.y )
	{
		gl_FragColor = vec4( 0.25, 0.25, 0.25, 1. );
	}
}
