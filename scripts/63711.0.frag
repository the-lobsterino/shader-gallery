/*
 * Original shader from: https://www.shadertoy.com/view/4lfyRS
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
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
float time = iTime/2.;
float xf = .03272492438555;
float ymin = 10000.;
float ymax = -10000.;
float mas = iResolution.x/400.;
float x1=fragCoord.x/mas;
vec3 col = vec3(0.);
for(float zi=-64.; zi<=64.; zi++)
   {
   float zs = 5.0625 * zi * zi;
   float xi = x1 - zi - 200.;
   if(xi * xi < 144.*144. - zs) 
  	{	   
      float xt = sqrt(xi * xi + zs) * xf;
      float yy = (sin(xt)+sin(xt*3.)*.4)*56.;
      float y1 = mas*(120. + yy - zi * cos(time) - xi * sin(time) / 2.);
      if(y1 < ymin)
         {
	   if(abs(y1-fragCoord.y)<1.5)
	      col+=vec3(0.,0.,1.)*smoothstep(-1.5, 1.5, 1.5-abs(y1-fragCoord.y));
         ymin = y1 - 1.;
         }
	if(y1 > ymax)
	   {
	   if(abs(y1-fragCoord.y)<1.5)
	     	col+=vec3(1.,0.,0.)*smoothstep(-1.5, 1.5, 1.5-abs(y1-fragCoord.y));
	   ymax = y1 + 1.;
         }
      }
   }
fragColor = vec4(col,1.);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}