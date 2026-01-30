#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 SpectrumToRgbImpulse(float infra, float red, float yellow, float green, float cyan, float blue, float violet)
{
	return vec3(red, green, blue);
}

vec3 SpectrumToRgbTent(float infra, float red, float yellow, float green, float cyan, float blue, float violet)
{
	return vec3(
		0.25 * infra  + 0.5 * red   + 0.25 * yellow,
		0.25 * yellow + 0.5 * green + 0.25 * cyan,
		0.25 * cyan   + 0.5 * blue  + 0.25 * violet
		);
}

vec3 SpectrumToRgbGauss(float infra, float red, float yellow, float green, float cyan, float blue, float violet)
{
	return vec3(
		0.1 * violet + 0.2 * infra  + 0.4 * red    + 0.2 * yellow + 0.1 * green,
		0.1 * infra  + 0.2 * yellow + 0.4 * green  + 0.2 * cyan   + 0.1 * blue,
		0.1 * green  + 0.2 * cyan   + 0.4 * blue   + 0.2 * violet + 0.1 * red
		);
}

vec3 SpectrumToRgb(float infra, float red, float yellow, float green, float cyan, float blue, float violet)
{
	//return SpectrumToRgbImpulse(infra,red,yellow,green,cyan,blue,violet);
	return SpectrumToRgbTent(infra,red,yellow,green,cyan,blue,violet);
	//return SpectrumToRgbGauss(infra,red,yellow,green,cyan,blue,violet);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;

	float infra[3];
	float red[3];
	float yellow[3];
	float green[3];
	float cyan[3];
	float blue[3];
	float violet[3];
	
	infra [0] = infra [1] = 1.0;
	red   [0] = red   [1] = 1.0;
	yellow[0] = yellow[1] = 1.0;
	green [0] = green [1] = 1.0;
	cyan  [0] = cyan  [1] = 1.0;
	blue  [0] = blue  [1] = 1.0;
	violet[0] = violet[1] = 1.0;

	float y = position.y * 4.0;
	
	infra [0] = 0.5 + 0.5 * sin (y * 2.0);
	red   [0] = 0.5 + 0.5 * sin (y * 3.0);
	yellow[0] = 0.5 + 0.5 * sin (y * 5.0);
	green [0] = 0.5 + 0.5 * sin (y * 7.0);
	cyan  [0] = 0.5 + 0.5 * sin (y * 11.0);
	blue  [0] = 0.5 + 0.5 * sin (y * 13.0);
	violet[0] = 0.5 + 0.5 * sin (y * 17.0);
	
	infra [1] = 0.5 + 0.5 * sin (y * 19.0);
	red   [1] = 0.5 + 0.5 * sin (y * 23.0);
	yellow[1] = 0.5 + 0.5 * sin (y * 29.0);
	green [1] = 0.5 + 0.5 * sin (y * 31.0);
	cyan  [1] = 0.5 + 0.5 * sin (y * 37.0);
	blue  [1] = 0.5 + 0.5 * sin (y * 41.0);
	violet[1] = 0.5 + 0.5 * sin (y * 43.0);
	
	if (length(position - mouse) < 0.1)
	{
		//Inside circle.
		//Simulate spectrum (world) -> RGB (camera/texture) -> spectrum (computer)

		//Spectrum -> RGB
		vec3 temp[2];
		temp[0] = SpectrumToRgb(infra[0],red[0],yellow[0],green[0],cyan[0],blue[0],violet[0]);
		temp[1] = SpectrumToRgb(infra[1],red[1],yellow[1],green[1],cyan[1],blue[1],violet[1]);
		
		red[0] = temp[0].r;
		red[1] = temp[1].r;
		green[0] = temp[0].g;
		green[1] = temp[1].g;
		blue[0] = temp[0].b;
		blue[1] = temp[1].b;
		
		//RGB -> spectrum
		infra[0] = red[0];
		infra[1] = red[1];
		yellow[0] = 0.5 * (red[0] + green[0]);
		yellow[1] = 0.5 * (red[1] + green[1]);
		cyan[0] = 0.5 * (green[0] + blue[0]);
		cyan[1] = 0.5 * (green[1] + blue[1]);
		violet[0] = blue[0];
		violet[1] = blue[1];
	}
		
	vec3 col[3];

	if (gl_FragCoord.x < 0.5 * resolution.x)
	{
		//Left side.
		//Multiply 2 colours in RGB space
		
		//Spectrum -> RGB
		col[0] = SpectrumToRgb(infra[0],red[0],yellow[0],green[0],cyan[0],blue[0],violet[0]);
		col[1] = SpectrumToRgb(infra[1],red[1],yellow[1],green[1],cyan[1],blue[1],violet[1]);
	
		//Simple RGB multiply
		col[2] = col[0] * col[1];
	}
	else
	{
		//Right side.
		//Multiply 2 colours in 7-component spectrum space.
		//Notice how this produces a different result.
		
		//Multiply spectra
		infra [2] = infra [0] * infra [1];
		red   [2] = red   [0] * red   [1];
		yellow[2] = yellow[0] * yellow[1];
		green [2] = green [0] * green [1];
		cyan  [2] = cyan  [0] * cyan  [1];
		blue  [2] = blue  [0] * blue  [1];
		violet[2] = violet[0] * violet[1];

		//Spectrum -> RGB
		col[2] = SpectrumToRgb(infra[2],red[2],yellow[2],green[2],cyan[2],blue[2],violet[2]);
	}
	
	//Gamma correct
	col[2] = pow(col[2], vec3(1.0/2.2));
	
	gl_FragColor = vec4(col[2],1.0);

}