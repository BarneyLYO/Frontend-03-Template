export const linear = v => v;

export function cubicBezier(p1x, p1y, p2x, p2y) {
	const ZERO_LIMT = 1e-6;

	const ax = 3 * p1x - 3 * p2x + 1;
	const bx = 3 * p2x - 6 * p1x;
	const cx = 3 * p1x;

	const ay = 3 * p1y - 3 * p2y + 1;
	const by = 3 * p2y - 6 * p1y;
	const cy = 3 * p1y;

	function sampleCurveDerivativeX(t) {
		return (3 * ax * t + 2 * bx) * t + cx;
	}

	function sampleCurveX(t) {
		return ((ax * t + bx) * t + cx) * t;
	}

	function sampleCurveY(t) {
		return ((ay * t + by) * t + cy) * t;
	}

	function solveCurveX(x) {
		var t2 = x;
		var derivative;
		var x2;

		for (let i = 0; i < 8; i++) {
			x2 = sampleCurveX(t2) - x;

			if (Math.abs(x2) < ZERO_LIMT) {
				return t2;
			}
			derivative = sampleCurveDerivativeX(t2);

			if (Math.abs(derivative) < ZERO_LIMT) {
				break;
			}

			t2 -= x2 / derivative;
		}

		var t1 = 1;

		var t0 = 0;

		t2 = x;

		while (t1 > t0) {
			x2 = sampleCurveX(t2) - x;
			if (Math.abs(x2) < ZERO_LIMT) {
				return t2;
			}

			if (x2 > 0) {
				t1 = t2;
			} else {
				t0 = t2;
			}

			t2 = (t1 + t0) / 2;
		}
		return t2;
	}

	function solve(x) {
		return sampleCurveY(solveCurveX(x));
	}
	return solve;
}

export const ease = cubicBezier(0.25, 0.1, 0.25, 0.1);

export const easeIn = cubicBezier(0.42, 0, 1, 1);

export const easeOut = cubicBezier(0, 0, 0.58, 1);

export const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
