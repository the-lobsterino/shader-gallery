#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

//uniform sampler1D texFFT;

//layout(location = 0) out vec4 out_color;

//float fft(float f){return texture(texFFT, f/textureSize(texFFT,0)).r;}

bool circle(vec2 circ, float rad, vec4 color)
{
  vec2 p = ( gl_FragCoord.xy / resolution.xy );
  if (sqrt(((p.x-circ.x)*(p.x-circ.x))*resolution.x*resolution.x+((p.y-circ.y)*(p.y-circ.y))*resolution.y*resolution.y)<rad){
		out_color = color;
    return true;
	}
  else return false;
}

void main( void ) 
{
  vec2 uv = vec2(gl_FragCoord.x / v2Resolution.x, gl_FragCoord.y / v2Resolution.y);
  uv -= 0.5;
  uv /= vec2(v2Resolution.y / v2Resolution.x, 1);
  
  //out_color = vec4(1.0, 1., 0.4, 1.);
  
  float sdvig = cos(fGlobalTime)/2.+2.;
	vec2 circ = vec2(.5, .5);	
	vec2 p = ( gl_FragCoord.xy / v2Resolution.xy );
	float rad = 50.*sdvig+50.*fft(3.);
	float rad2 = 60.*(sin(fGlobalTime*1.5)/4.+2.);
	float rad3 = 70.*(cos(fGlobalTime*1.5)/4.+2.);
  
  if(!circle(vec2(.5, .5), rad, vec4( p.x-.2, p.y-.7, 0.6 , 1.0 )))
    if(!circle(vec2(.5, .5), rad2, vec4( p.x, .4, p.x+.5 , 1.0 )))
      if(!circle(vec2(.5, .5), rad3, vec4( p.y, p.x-0.3, 0.6 , 1.0 )))
        if (p.y>(0.5-0.5*(cos(fGlobalTime)+1.)/2.)-.3*fft(2.)&&p.y<(0.5+0.5*(cos(fGlobalTime)+1.)/2.)+.3*fft(2.))
        {
          out_color = vec4( p.y , p.x, 1. , 1.0 );	
        }
        else	
        out_color = vec4( p.y-0.5 , 1.-p.y, p.y , 1.0 );
    
}}