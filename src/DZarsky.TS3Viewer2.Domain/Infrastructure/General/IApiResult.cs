using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DZarsky.TS3Viewer2.Domain.Infrastructure.General
{
    public interface IApiResult<TResult>
    {
        /// <summary>
        /// Determines the success status.
        /// </summary>
        /// <value>
        /// The success status
        /// </value>
        bool IsSuccess { get; set; }

        /// <summary>
        /// Gets or sets the reason code.
        /// </summary>
        /// <value>
        /// The reason.
        /// </value>
        string? ReasonCode { get; set; }

        /// <summary>
        /// Gets or sets the error or info message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        string? Message { get; set; }

        /// <summary>
        /// Gets or sets the result.
        /// </summary>
        /// <value>
        /// The result.
        /// </value>
        TResult? Result { get; set; }
    }
}
